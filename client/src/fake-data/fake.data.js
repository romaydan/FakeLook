import faker, { fake } from 'faker';

export const createFakePosts = () => {
    const posts = [];

    for (let index = 0; index <= 4; index++) {
        const id = faker.random.uuid();
        const post = {
            id: id,
            publisherId: faker.random.uuid(),
            imageUrl: faker.image.imageUrl(900, 450),
            location: {
                type: 'Point',
                coordinates: faker.address.nearbyGPSCoordinate([34.8762222964216, 32.02693822368098], 2.5)
            },
            textContent: faker.lorem.slug(25),
            showTo: faker.random.number(1),
            createdAt: faker.date.recent(),
            likes: [
                {
                    id: faker.random.uuid(),
                    userId: faker.random.uuid()
                },
                {
                    id: faker.random.uuid(),
                    userId: faker.random.uuid()
                },
                {
                    id: faker.random.uuid(),
                    userId: faker.random.uuid()
                }],
            userTags: [
                {
                    id: faker.random.uuid(),
                    userId: faker.random.uuid(),
                    user: faker.name.firstName() + ' ' + faker.name.lastName()
                },
                {
                    id: faker.random.uuid(),
                    userId: faker.random.uuid(),
                    user: faker.name.firstName() + ' ' + faker.name.lastName()
                },
                {
                    id: faker.random.uuid(),
                    userId: faker.random.uuid(),
                    user: faker.name.firstName() + ' ' + faker.name.lastName()
                },
                {
                    id: faker.random.uuid(),
                    userId: faker.random.uuid(),
                    user: faker.name.firstName() + ' ' + faker.name.lastName()
                },
                {
                    id: faker.random.uuid(),
                    userId: faker.random.uuid(),
                    user: faker.name.firstName() + ' ' + faker.name.lastName()
                }
            ],
            tags: [
                {
                    id: faker.random.uuid(),
                    content: faker.lorem.words(3).replace(' ', '_')
                },
                {
                    id: faker.random.uuid(),
                    content: faker.lorem.words(3).replace(' ', '_')
                },
                {
                    id: faker.random.uuid(),
                    content: faker.lorem.words(3).replace(' ', '_')
                },
                {
                    id: faker.random.uuid(),
                    content: faker.lorem.words(3).replace(' ', '_')
                }
            ],
            comments: [
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                },
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                },
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                },
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                },
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                },
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                },
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                },
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                },
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                },
                {
                    user: faker.name.firstName() + ' ' + faker.name.lastName(),
                    content: faker.lorem.sentences()
                }
            ]
        }

        posts.push(post);
    }

    return posts;
}

export const createFakeFriends = () => {
    const friends = [];
    for (let index = 0; index <= 10; index++) {
        const friend = {
            id: faker.random.uuid(),
            name: faker.name.firstName() + ' ' + faker.name.lastName(),
            birthDate: faker.date.past()
        }

        friends.push(friend);
    }

    return friends;
}