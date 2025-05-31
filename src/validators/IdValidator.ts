export const isValidULID = (ulid: string): boolean => {
    const ulidRegex = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/;
    return ulidRegex.test(ulid);
};