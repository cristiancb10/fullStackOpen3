const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const listWithBlogs = require('./test_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithBlogs.initialBlogs)
        assert.strictEqual(result, 36)
    })

    test('returns null when list is empty', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })
})

describe('favorite blog', () => {

    test('the favorite blog has the same amount of likes equal to', () => {
        const result = listHelper.favoriteBlog(listWithBlogs.initialBlogs)
        assert.deepStrictEqual(result,
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12,
            })
        console.log('favorite blog:', result)
    })

    test('returns null when list is empty', () => {
        const result = listHelper.favoriteBlog([])
        assert.strictEqual(result, null)
    })
})

describe('maximum number of blogs', () => {
    test('returns null when list is empty', () => {
        const result = listHelper.mostBlogs([])
        assert.strictEqual(result, null)
    })

    test('Author with the most published blogs', () => {
        const result = listHelper.mostBlogs(listWithBlogs.initialBlogs)
        assert.deepStrictEqual(result, {
            author: "Robert C. Martin",
            blogs: 3
        })
        console.log('Author with the most published blogs:')
        console.log(JSON.stringify(result, null, 2))
    })
})

describe('maximum number of likes', () => {
    test('returns null when list is empty', () => {
        const result = listHelper.mostLikes([])
        assert.strictEqual(result, null)
    })

    test('author with blogs with the highest number of likes', () => {
        const result = listHelper.mostLikes(listWithBlogs.initialBlogs)
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 17
        })
        console.log('author with blogs with the highest number of likes:')
        console.log(JSON.stringify(result, null, 2))
    })
})