export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const SitePartsFragmentDoc = gql`
    fragment SiteParts on Site {
  __typename
  meta {
    __typename
    title
    description
  }
  nav {
    __typename
    brand
    subbrand
    cta_secondary
    cta_primary
  }
  hero {
    __typename
    tag
    title
    title_highlight
    description
    cta_primary
    cta_secondary
    badge1
    badge2
  }
  value {
    __typename
    tag
    title
    title_highlight
    description
    link_text
    features {
      __typename
      icon
      title
      desc
    }
  }
  servicios {
    __typename
    tag
    title
    title_highlight
    description
    footer_text
    footer_link
    tabs {
      __typename
      id
      icon
      label
      planes {
        __typename
        nombre
        icon
        precio
        periodo
        desc
        popular
        features {
          __typename
          text
          included
        }
      }
    }
  }
  porque {
    __typename
    tag
    title
    title_highlight
    description
    founder_name
    founder_role
    features {
      __typename
      icon
      title
      desc
    }
  }
  stats {
    __typename
    target
    suffix
    label
  }
  portafolio {
    __typename
    tag
    title
    title_highlight
    items {
      __typename
      categoria
      titulo
      color1
      color2
      icon
    }
  }
  testimonios {
    __typename
    tag
    title
    title_highlight
    items {
      __typename
      texto
      nombre
      rol
      iniciales
    }
  }
  nosotros {
    __typename
    tag
    title
    title_highlight
    descripcion1
    descripcion2
    fundacion
    paises
    clientes
    equipo {
      __typename
      nombre
      rol
      iniciales
    }
  }
  faq {
    __typename
    tag
    title
    title_highlight
    items {
      __typename
      pregunta
      respuesta
    }
  }
  contacto {
    __typename
    tag
    title
    title_highlight
    subtitulo
    telefono
    email
    ubicacion
    horario
    badge_title
    badge_desc
    servicios_form
  }
  cta {
    __typename
    tag
    title
    title_highlight
    description
    cta_primary
    cta_secondary
  }
  footer {
    __typename
    tagline
    copyright
  }
}
    `;
export const SiteDocument = gql`
    query site($relativePath: String!) {
  site(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...SiteParts
  }
}
    ${SitePartsFragmentDoc}`;
export const SiteConnectionDocument = gql`
    query siteConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: SiteFilter) {
  siteConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...SiteParts
      }
    }
  }
}
    ${SitePartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    site(variables, options) {
      return requester(SiteDocument, variables, options);
    },
    siteConnection(variables, options) {
      return requester(SiteConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
