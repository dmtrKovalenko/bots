import Meta from "./Meta";

export default class ViberMeta extends Meta {
  constructor(message: any, response: any) {
    super()
    this.userId = response.userProfile.id;
  }
}
