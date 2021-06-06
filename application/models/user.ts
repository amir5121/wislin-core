import BaseNode from "./base-node"

export default class User extends BaseNode {
  id: number
  email: string
  firstName: string
  lastName: string
  googleId: string
  birthDate: Date
  createdAt: Date
  updatedAt: Date
  profilePicture: string

  // skills: [{ type: Schema.Types.ObjectId; ref: "Skill" }]

  constructor(
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    googleId: string,
    birthDate: Date,
    createdAt: Date,
    updatedAt: Date,
    profilePicture: string
  ) {
    super()
    this.id = id
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.googleId = googleId
    this.birthDate = birthDate
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.profilePicture = profilePicture
  }

  // gravatar: (size: number) => string;
  fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  getClaims() {
    const { username, email, bio, image } = this.node.properties

    return {
      sub: username,
      username,
      email,
      bio,
      image: image || "https://picsum.photos/200",
    }
  }

  toJson() {
    const { password, bio, image, ...properties } = this.node.properties

    return {
      image: image || "https://picsum.photos/200",
      bio: bio || null,
      following: this.following,
      ...properties,
    }
  }

  update(properties: User) {
    return this.write(
      `
            MATCH (u:User {id: $id})
            SET u += $properties
            RETURN u
        `,
      { id: this.id, properties }
    ).then((res) => {
      this.node = res.records[0].get("u")
      return this
    })
  }
}
