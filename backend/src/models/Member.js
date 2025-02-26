class Member {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.party = data.party;
    this.constituency = data.constituency;
    this.province = data.province;
    this.email = data.email;
    this.phone = data.phone;
    this.photo_url = data.photo_url;
    this.roles = data.roles || [];
    this.office = {
      address: data.office_address,
      phone: data.office_phone
    };
  }

  static fromApiResponse(data) {
    return new Member(data);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      party: this.party,
      constituency: this.constituency,
      province: this.province,
      email: this.email,
      phone: this.phone,
      photo_url: this.photo_url,
      roles: this.roles,
      office: this.office
    };
  }
}

export default Member;