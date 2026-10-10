export const fetchData = async () => {
    const response = await fetch(
        "https://jsonlint.com/datasets/test-large-array.json",
    );
    const result = await response.json();
    if (!Array.isArray(result.items))
        throw new Error("Unexpected response shape");
    return result.items;
};
