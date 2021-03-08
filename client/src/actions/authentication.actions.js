export const AUTHENTICATED = 'AUTHENTICATED';
export const UNAUTHENTICATE = 'UNAUTHENTICATE';
export const REFRESH = 'REFRESH';

export const authenticated = (accessToken) => ({
    type: AUTHENTICATED,
    accessToken
});

export const unauthnticate = () => ({
    type: UNAUTHENTICATE
})