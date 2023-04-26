class ApiFeatures {
  // /product/
  // keyword : query
  constructor(query, queryStr) {
    this.query = query; //--> Product.find()
    this.queryStr = queryStr; //--> keyword=heeng
  }
  // ==> firstly searching the keyword and after we have find the data, we are going more specific on the category
  search() {
    const keyword = this.queryStr.keyword
      ? {
          // if keyword exist
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", //-> case insensitive, works for both smaller and uppercase,
          },
        }
      : {};
    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this; // returning this class
  }

  filter() {
    // const queryCopy = this.queryStr; ==> queryStr is an object and all object in javascript are passed through reference so to avoid this
    const queryCopy = { ...this.queryStr }; // ==> spread operator to create another object which wont effect the global reference for querystr

    console.log(queryCopy);
    // --> category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]); // ==> filter for category

    // => filtering based on price range and rating
    // example__ price > 500 && price <1000
    // for such functionality = mongodb provide operator like $gt $lt
    // we are adding  $- infront of our keys - gt and lt to make it work
    console.log(queryCopy);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lte|lt)\b/g, (key) => `$${key}`);

    // --> finding in the database
    this.query = this.query.find(JSON.parse(queryStr)); // ==> Product.find({category:"exampleProduct", prce: {$gt: 500 , $lt:1000}})
    console.log(queryStr);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1; // 50 product in db - 10 per pages
    // 1st page: 0 - 10, 2nd page: 11 - 20, ...
    const skip = resultPerPage * (currentPage - 1);
    // limit: will restrict and allow the given amount of data and skip will skip the first n data products
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
