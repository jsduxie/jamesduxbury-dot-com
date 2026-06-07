// the single source of which url schemes may render as links, shared by the parser,
// the zod validation, the page renderer and the contact email
export const LINK_SCHEME = 'https?:|mailto:';
export const SAFE_HREF = new RegExp(`^(${LINK_SCHEME})`, 'i');
