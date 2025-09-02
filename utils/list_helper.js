const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const favorite = blogs.reduce((prev, current) => {
        return prev.likes > current.likes ? prev : current
    })

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

module.exports = { dummy, totalLikes, favoriteBlog }