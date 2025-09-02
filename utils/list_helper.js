const lodash = require('lodash')

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

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const countAuthors = lodash.countBy(blogs, 'author')

    const authorBlogs = lodash.map(countAuthors, (blogs, author) => ({
        author,
        blogs
    }))

    return lodash.maxBy(authorBlogs, 'blogs')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }