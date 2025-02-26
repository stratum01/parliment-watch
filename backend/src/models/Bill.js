class Bill {
  constructor(data) {
    this.id = data.id;
    this.number = data.number;
    this.name = {
      en: data.name?.en,
      fr: data.name?.fr
    };
    this.status = data.status;
    this.introduced = data.introduced_date;
    this.sponsor = data.sponsor;
    this.lastEvent = data.last_event;
    this.progress = data.progress;
    this.session = data.session;
    this.text_url = data.text_url;
  }

  static fromApiResponse(data) {
    return new Bill(data);
  }

  toJSON() {
    return {
      id: this.id,
      number: this.number,
      name: this.name,
      status: this.status,
      introduced_date: this.introduced,
      sponsor: this.sponsor,
      last_event: this.lastEvent,
      progress: this.progress,
      session: this.session,
      text_url: this.text_url
    };
  }
}

export default Bill;
