import * as faker from 'faker'

const userShape = () => ({
    id: faker.random.uuid(),
    userName: faker.internet.userName(),
    dateOfBirth: faker.date.past(
        50,
        new Date('Sat Sep 20 1992 21:35:02 GMT+0200 (CEST)')
    ),
    phone: faker.phone.phoneNumber(),
    bio: faker.lorem.paragraph(),
    email: faker.internet.email(),
    password: 'Pass_wd@123',
    profilePhoto: faker.internet.avatar(),
    showProfile: faker.random.boolean(),
    city: faker.address.city(),
    country: faker.address.country(),
    instagramLink: `https:/instagram.com/${faker.internet.userName()}`,
    isInstagramActive: faker.random.boolean(),
    twitterLink: `https:/twitter.com/${faker.internet.userName()}`,
    isTwitterActive: faker.random.boolean(),
    facebookLink: `https:/twitter.com/${faker.internet.userName()}`,
    isFacebookActive: faker.random.boolean(),
    linkedinLink: `https:/twitter.com/${faker.internet.userName()}`,
    isLinkedinActive: faker.random.boolean(),
    searchRadius: 100000,
    oauthProviders: faker.random.boolean()
        ? [
              {
                  id: faker.random.uuid(),
                  type: 'GOOGLE',
              },
          ]
        : [],
})

export default (amount = 10) => {
    const users: any[] = []
    for (let i = 0; i < amount; i += 1) {
        users.push({ ...userShape() })
    }

    console.log(`=> Created ${amount} users`)

    return users
}
