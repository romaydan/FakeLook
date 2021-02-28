import { IPost, ShowOptions } from "../../src/models/post.model";
import { PostRepository } from "../../src/repositories/post.repository";
import { ImageUploader, IImageUploader } from "../../src/services/image.uploader";
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
        getFilteredPost: (userFilter, tagFliter, publisherId, distance, from, to) => {
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
        if(!accessToken || !userId || !postId || !uploadFile) {
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
                    coordinates: [2,1]
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
})

describe('testing removePost', () => {
    
})