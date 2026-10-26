type newPost = {
    title: string;
    body: string;
};

export const createPost = async (newPost: newPost) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
    });
    if (!response.ok) {
        throw new Error("Failed to create post");
    }

    return response.json();
};
