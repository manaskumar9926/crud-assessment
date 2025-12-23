
export const getPagination = (page: number = 1, limit: number = 10) => {
    console.log("📄 [PAGINATION] Calculating pagination - page:", page, "limit:", limit);
    const take = Math.max(1, limit);
    const skip = (Math.max(1, page) - 1) * take;
    console.log("📄 [PAGINATION] Result - skip:", skip, "take:", take);

    return {
        skip,
        take,
    };
};
