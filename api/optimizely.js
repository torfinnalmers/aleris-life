/**
 * Optimizely ContentGraph API Client
 *
 * Queries the Aleris website content via Optimizely's GraphQL API
 */

const OPTIMIZELY_ENDPOINT = 'https://cg.optimizely.com/content/v2';

/**
 * Execute a GraphQL query against Optimizely ContentGraph
 */
async function executeQuery(query, variables = {}) {
  const singleKey = process.env.OPTIMIZELY_SINGLE_KEY;

  if (!singleKey) {
    console.warn('OPTIMIZELY_SINGLE_KEY not configured');
    return null;
  }

  try {
    // Optimizely uses auth as query parameter, not Basic auth header
    const url = `${OPTIMIZELY_ENDPOINT}?auth=${singleKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.error('Optimizely API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Optimizely fetch error:', error);
    return null;
  }
}

/**
 * Fetch all location/clinic pages
 */
export async function fetchLocationPages() {
  const query = `
    query LocationPages {
      LocationPage {
        items {
          Name
          Url
          MainContentArea {
            ContentLink {
              Expanded {
                ContentType
                Name
                ... on ContentBlock {
                  Text
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await executeQuery(query);
  return data?.LocationPage?.items || [];
}

/**
 * Search for content by name/text
 */
export async function searchContent(searchTerm) {
  const query = `
    query SearchContent($searchTerm: String!) {
      Content(
        where: {
          _or: [
            { Name: { contains: $searchTerm } }
          ]
        }
        limit: 20
      ) {
        items {
          Name
          ContentType
          Url
          ... on LocationPage {
            MainContentArea {
              ContentLink {
                Expanded {
                  Name
                  ... on ContentBlock {
                    Text
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await executeQuery(query, { searchTerm });
  return data?.Content?.items || [];
}

/**
 * Fetch content by specific content type
 */
export async function fetchContentByType(contentType) {
  const query = `
    query ContentByType {
      ${contentType} {
        items {
          Name
          Url
          ContentType
        }
      }
    }
  `;

  const data = await executeQuery(query);
  return data?.[contentType]?.items || [];
}

/**
 * Fetch all available content types (for exploration)
 */
export async function fetchContentTypes() {
  const query = `
    query ContentTypes {
      __schema {
        types {
          name
          kind
        }
      }
    }
  `;

  const data = await executeQuery(query);
  return data?.__schema?.types || [];
}

/**
 * Parse rich text content from Optimizely format to plain text
 */
export function parseRichText(richTextJson) {
  if (!richTextJson) return '';

  try {
    const parsed = typeof richTextJson === 'string' ? JSON.parse(richTextJson) : richTextJson;

    function extractText(node) {
      if (!node) return '';
      if (node.type === 'PlainText') return node.text || '';
      if (node.children) {
        return node.children.map(extractText).join(' ');
      }
      return '';
    }

    return extractText(parsed).trim();
  } catch {
    return richTextJson;
  }
}

/**
 * Format location data for AI context
 */
export function formatLocationsForContext(locations) {
  if (!locations || locations.length === 0) return '';

  return locations.map(loc => {
    let content = `## ${loc.Name}\n`;
    if (loc.Url) content += `URL: ${loc.Url}\n`;

    if (loc.MainContentArea) {
      loc.MainContentArea.forEach(area => {
        const expanded = area?.ContentLink?.Expanded;
        if (expanded) {
          if (expanded.Name) content += `### ${expanded.Name}\n`;
          if (expanded.Text) {
            const text = parseRichText(expanded.Text);
            if (text) content += `${text}\n`;
          }
        }
      });
    }

    return content;
  }).join('\n---\n');
}

/**
 * Check if Optimizely is configured and available
 */
export function isOptimizelyConfigured() {
  return !!process.env.OPTIMIZELY_SINGLE_KEY;
}
