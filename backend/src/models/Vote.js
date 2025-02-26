class Vote {
  constructor(data) {
    this.id = data.id;
    this.number = data.number;
    this.date = data.date;
    this.result = data.result;
    this.yeaTotal = data.yea_total;
    this.nayTotal = data.nay_total;
    this.paired = data.paired_total;
    this.billUrl = data.bill_url;
    this.description = {
      en: data.description?.en,
      fr: data.description?.fr
    };
  }

  static fromApiResponse(data) {
    return new Vote(data);
  }

  toJSON() {
    return {
      id: this.id,
      number: this.number,
      date: this.date,
      result: this.result,
      yea_total: this.yeaTotal,
      nay_total: this.nayTotal,
      paired_total: this.paired,
      bill_url: this.billUrl,
      description: this.description
    };
  }
}

export default Vote;