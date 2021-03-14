import UserError from "../../src/errors/user.error";
import { IPost, ShowOptions } from "../../src/models/post.model";
import { PostRepository } from "../../src/repositories/post.repository";
import { IImageUploader } from "../../src/services/image.uploader";
import { PostService } from "../../src/services/post.service";

let posts: IPost[];

jest.mock('../../src/repositories/post.repository');
const mockPostRespository = <jest.Mock<PostRepository>>PostRepository;
mockPostRespository.mockImplementation(() => {
    return ({
        getPostById: (postId) => {
            return Promise.resolve(posts.find(p => p.id === postId));
        },
        getAllPostsByUserId: (userId) => {
            return Promise.resolve(posts.filter(p => p.publisherId === userId));
        },
        getFilteredPost: (userFilter, tagFliter, publisherId, location, distance, from, to) => {
            return Promise.resolve(posts.filter(p => {
                return p.createdAt >= from && p.createdAt <= to && publisherId.includes(p.publisherId)
                    && p.userTags.some(ut => userFilter.includes(ut.id))
                    && p.tags.some(t => tagFliter.includes(t.id))
            }));
        },
        addPost: (post) => {
            if (!post) {
                return Promise.reject(new Error());
            }
            post.id = '3';
            posts.push(post);

            return Promise.resolve(post);
        },
        removePost: (postId) => {
            const post = posts.find(p => p.id === postId);
            posts = posts.filter(p => p.id !== postId);
            return Promise.resolve(post);
        },
        updatePost: (post) => {
            const index = posts.findIndex(p => p.id === post.id);
            if (index >= 0) {
                posts[index] = post;
                return Promise.resolve(true);
            }

            return Promise.resolve(false);
        }
    }) as PostRepository;
});

jest.mock('../../src/services/image.uploader');

class MockImageUploader implements IImageUploader {
    uploadImage(userId, postId, uploadFile, accessToken) {
        if (!accessToken || !userId || !postId || !uploadFile) {
            throw new Error();
        }

        return Promise.resolve('http://images.com/image/test.jpeg');
    }

    deleteImage(imageUrl, accessToken) {
        return Promise.resolve(true);
    }
}


describe('testing addPost', () => {
    beforeEach(() => {
        posts = [
            {
                id: '1',
                publisherId: '1234',
                location: {
                    type: 'Point',
                    coordinates: [2, 1]
                },
                textContent: 'test',
                showTo: ShowOptions.Followers,
                imageUrl: 'http://images.com/image/test.jpeg',
                tags: [{
                    id: '1',
                    content: 'test'
                }],
                comments: [{
                    id: '2',
                    postId: '1',
                    name: 'test',
                    userId: '123',
                    content: 'test comment post1'
                }],
                likes: [{
                    id: '2',
                    userId: '123',
                    postId: '1'
                }],
                userTags: [{
                    id: '2',
                    name: 'test2',
                    userId: '123',
                    postId: '1'
                }]
            },
            {
                id: '2',
                publisherId: '1234',
                location: {
                    type: 'Point',
                    coordinates: [3, 4]
                },
                textContent: 'test',
                showTo: ShowOptions.All,
                imageUrl: 'http://images.com/image/test.jpeg',
                tags: [{
                    id: '1',
                    content: 'test'
                }],
                comments: [{
                    id: '1',
                    postId: '2',
                    name: 'test',
                    userId: '123',
                    content: 'test comment'
                }],
                likes: [{
                    id: '1',
                    userId: '123',
                    postId: '2'
                }],
                userTags: [{
                    id: '1',
                    name: 'test2',
                    userId: '123',
                    postId: '2'
                }]
            }
        ]
    })

    test('passing valid arguments, expecting post to be added', () => {
        const newPost: IPost = {
            publisherId: '1234',
            location: {
                type: 'Point',
                coordinates: [1, 2]
            },
            textContent: 'test post',
            showTo: ShowOptions.All,
            imageUrl: ''
        }, uploadFile = {}, accessToken = 'test access token';
        const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
        const service = new PostService(repository, uploader);

        expect(service.addPost(newPost, uploadFile, accessToken))
            .resolves
            .toBe(newPost);
    });

    test('passing no post, expecting an error', () => {
        const uploadFile = {}, accessToken = 'test access token';
        const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
        const service = new PostService(repository, uploader);

        expect(service.addPost(undefined, uploadFile, accessToken))
            .rejects
            .toThrow();
    })

    test('passing no accessToken and uploadFile, expecting an error', () => {
        const newPost: IPost = {
            publisherId: '1234',
            location: {
                type: 'Point',
                coordinates: [1, 2]
            },
            textContent: 'test post',
            showTo: ShowOptions.All,
            imageUrl: ''
        };
        const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
        const service = new PostService(repository, uploader);

        expect(service.addPost(newPost, undefined, undefined))
            .rejects
            .toThrow();
    });
});

describe('testing removePost', () => {
    beforeEach(() => {
        posts = [
            {
                id: '1',
                publisherId: '1234',
                location: {
                    type: 'Point',
                    coordinates: [2, 1]
                },
                textContent: 'test',
                showTo: ShowOptions.Followers,
                imageUrl: 'http://images.com/image/test.jpeg',
                tags: [{
                    id: '1',
                    content: 'test'
                }],
                comments: [{
                    id: '2',
                    postId: '1',
                    name: 'test',
                    userId: '123',
                    content: 'test comment post1'
                }],
                likes: [{
                    id: '2',
                    userId: '123',
                    postId: '1'
                }],
                userTags: [{
                    id: '2',
                    name: 'test2',
                    userId: '123',
                    postId: '1'
                }]
            },
            {
                id: '2',
                publisherId: '1234',
                location: {
                    type: 'Point',
                    coordinates: [3, 4]
                },
                textContent: 'test',
                showTo: ShowOptions.All,
                imageUrl: 'http://images.com/image/test.jpeg',
                tags: [{
                    id: '1',
                    content: 'test'
                }],
                comments: [{
                    id: '1',
                    postId: '2',
                    name: 'test',
                    userId: '123',
                    content: 'test comment'
                }],
                likes: [{
                    id: '1',
                    userId: '123',
                    postId: '2'
                }],
                userTags: [{
                    id: '1',
                    name: 'test2',
                    userId: '123',
                    postId: '2'
                }]
            }
        ]
    });

    test('passing valid parameters, expecting post to be removed', async () => {
        const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
        const service = new PostService(repository, uploader);

        const postId = '1', userId = '1234';

        await service.removePostById(postId, userId, 'token');

        expect(posts.find(p => p.id === postId)).toBeUndefined();
    });

    test('passing invalid userId, expecting an error', async () => {
        try {
            const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
            const service = new PostService(repository, uploader);
            const postId = '1', userId = 'invalid';

            await service.removePostById(postId, userId, 'token');
        } catch (error) {
            expect(error).toBeInstanceOf(UserError)
        }
    });

    test('passing invalid postId, expecting undefined', async () => {
        const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
        const service = new PostService(repository, uploader);
        const postId = 'invalid', userId = '1234';

        const success = await service.removePostById(postId, userId, 'token');
        expect(success).toBe(false);
    })

    test('not passing postId, expecting a error', async () => {
        try {
            const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
            const service = new PostService(repository, uploader);
            const userId = '1234';

            await service.removePostById(undefined, userId, 'token');

        } catch (error) {
            expect(error).toBeInstanceOf(ReferenceError);
        }
    })
});

describe('testing getAllPostsByUserId', () => {
    beforeEach(() => {
        posts = [
            {
                id: '1',
                publisherId: '1234',
                location: {
                    type: 'Point',
                    coordinates: [2, 1]
                },
                textContent: 'test',
                showTo: ShowOptions.Followers,
                imageUrl: 'http://images.com/image/test.jpeg',
                tags: [{
                    id: '1',
                    content: 'test'
                }],
                comments: [{
                    id: '2',
                    postId: '1',
                    name: 'test',
                    userId: '123',
                    content: 'test comment post1'
                }],
                likes: [{
                    id: '2',
                    userId: '123',
                    postId: '1'
                }],
                userTags: [{
                    id: '2',
                    name: 'test2',
                    userId: '123',
                    postId: '1'
                }]
            },
            {
                id: '2',
                publisherId: '1234',
                location: {
                    type: 'Point',
                    coordinates: [3, 4]
                },
                textContent: 'test',
                showTo: ShowOptions.All,
                imageUrl: 'http://images.com/image/test.jpeg',
                tags: [{
                    id: '1',
                    content: 'test'
                }],
                comments: [{
                    id: '1',
                    postId: '2',
                    name: 'test',
                    userId: '123',
                    content: 'test comment'
                }],
                likes: [{
                    id: '1',
                    userId: '123',
                    postId: '2'
                }],
                userTags: [{
                    id: '1',
                    name: 'test2',
                    userId: '123',
                    postId: '2'
                }]
            }
        ]
    });

    test('passing valid userId, expecting 2 posts', async () => {
        const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
        const service = new PostService(repository, uploader);
        const userId = '1234';

        const posts = await service.getAllPostsByUserId(userId);

        expect(posts.length).toEqual(2);
    });

    test('passing none existing userId, expecting no posts', async () => {
        const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
        const service = new PostService(repository, uploader);
        const userId = 'invalid';

        const posts = await service.getAllPostsByUserId(userId);

        expect(posts.length).toEqual(0);
    })

    test('passing undefiend as userId, expecting an error', async () => {
        try {
            const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
            const service = new PostService(repository, uploader);

            await service.getAllPostsByUserId(undefined);

        } catch (error) {
            expect(error).toBeInstanceOf(UserError);
        }
    })
});

describe('testing getPostById', () => {
    beforeEach(() => {
        posts = [
            {
                id: '1',
                publisherId: '1234',
                location: {
                    type: 'Point',
                    coordinates: [2, 1]
                },
                textContent: 'test',
                showTo: ShowOptions.Followers,
                imageUrl: 'http://images.com/image/test.jpeg',
                tags: [{
                    id: '1',
                    content: 'test'
                }],
                comments: [{
                    id: '2',
                    postId: '1',
                    name: 'test',
                    userId: '123',
                    content: 'test comment post1'
                }],
                likes: [{
                    id: '2',
                    userId: '123',
                    postId: '1'
                }],
                userTags: [{
                    id: '2',
                    name: 'test2',
                    userId: '123',
                    postId: '1'
                }]
            },
            {
                id: '2',
                publisherId: '1234',
                location: {
                    type: 'Point',
                    coordinates: [3, 4]
                },
                textContent: 'test',
                showTo: ShowOptions.All,
                imageUrl: 'http://images.com/image/test.jpeg',
                tags: [{
                    id: '1',
                    content: 'test'
                }],
                comments: [{
                    id: '1',
                    postId: '2',
                    name: 'test',
                    userId: '123',
                    content: 'test comment'
                }],
                likes: [{
                    id: '1',
                    userId: '123',
                    postId: '2'
                }],
                userTags: [{
                    id: '1',
                    name: 'test2',
                    userId: '123',
                    postId: '2'
                }]
            }
        ]
    });

    test('passing valid postId, expecting a post', async () => {
        const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
        const service = new PostService(repository, uploader);
        const postId = '1';

        expect(await service.getPostById(postId)).toBe(posts[0]);
    });

    test('passing none exsitent postId, expecting undefined', async () => {
        const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
        const service = new PostService(repository, uploader);
        const postId = 'none exsitent';

        expect(await service.getPostById(postId)).toBeUndefined();
    });

    test('passing undefined as postId, expecting an error', async () => {
        try {
            const repository = mockPostRespository.getMockImplementation()(), uploader = new MockImageUploader()
            const service = new PostService(repository, uploader);

            await service.getPostById(undefined);
        } catch (error) {
            expect(error).toBeInstanceOf(UserError);
        }
    });
});

describe('testing updatePost', () => {
    
})
