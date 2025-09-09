const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const assert = require('node:assert')
const Blog = require('../models/blog')
const helper = require('./test_helper')

describe('When there are initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        for (let blog of helper.initialBlogs) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }
    })

    describe('property id and number of saved blogs', () => {
        test('all blogs all returned', async () => {
        const blogs = await helper.blogsInDb()

        assert.strictEqual(blogs.length, helper.initialBlogs.length)
        })

        test('The unique identifier for blogs should be called id', async () => {
            const allBlogs = await helper.blogsInDb()
            const blog = allBlogs[0]

            assert.ok(blog.id)

            assert.strictEqual(blog._id, undefined)
        })
    })

    describe('viewing a specific blog', () => {
        test('a specific title can be viewed', async () => {
            const blogsAtStart = await helper.blogsInDb()

            const blogToView = blogsAtStart[0]

            const resultNote = await api
                .get(`/api/blogs/${blogToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.deepStrictEqual(resultNote.body, blogToView)
        })
    })

    describe('in the creation of a new blog', () => {
        test('the blog was created successfully', async () => {
            const newBlog = {
                title: "Blog created",
                author: "Course Full Stack Open",
                url: "https://fullstackopen.com/",
                likes: 10
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.title, newBlog.title)
            assert.strictEqual(response.body.author, newBlog.author)
            assert.strictEqual(response.body.url, newBlog.url)
            assert.strictEqual(response.body.likes, newBlog.likes)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const titles = blogsAtEnd.map(blog => blog.title)
            assert(titles.includes(newBlog.title))
        })

        test('In the absence of a value in the likes property, this will be 0', async () => {
            const newBlog = {
                title: "Cero likes",
                author: "test for likes",
                url: "https://fullstackopen.com/",
            }

            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.likes, 0)
        })

        test('the title and the url are necessary', async () => {
            const newBlog = {
                author: "test for missing fields"
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

            const titles = blogsAtEnd.map(b => b.title)
            assert(!titles.includes(blogToDelete.title))
        })
    })

    describe('updating a blog', () => {
        test('succeeds with status code 200 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]

            const updatedBlog = {
                title: "more likes",
                author: "test for more likes",
                url: "https://fullstackopen.com/",
                likes: blogToUpdate.likes + 1
            }

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

            const blogsAtEnd = await helper.blogsInDb()
            const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
            assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
