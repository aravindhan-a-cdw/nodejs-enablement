const UserModel = require("../models/user");
const { PostModel } = require("../models/post");

const generateDynamicPipeline = (searchTerm, fieldsToExclude) => {

  const excludeFieldsProject = fieldsToExclude.reduce((acc, field) => {
    acc[field] = 0;
    return acc;
  }, {});

  const regex = new RegExp(searchTerm, 'i');
  return [
    {
      $match: {
        $text: { $search: searchTerm }
      }
    },
    // {
    //   $project: {
    //     matchedFields: {
    //       $filter: {
    //         input: { $objectToArray: '$$ROOT' },
    //         as: 'field',
    //         cond: { $regexMatch: { input: '$$field.v', regex: regex } }
    //       }
    //     },
    //     originalDocument: '$$ROOT'
    //   }
    // },
    {
      $project: {
        matchedFields: {
          $objectToArray: '$$ROOT'
        },
        originalDocument: '$$ROOT'
      }
    },
    {
      $unwind: '$matchedFields'
    },
    {
      $match: {
        'matchedFields.v': { $regex: searchTerm, $options: 'i' }
      }
    },
    {
      $group: {
        _id: '$matchedFields.k',
        documents: { $push: '$originalDocument' }
      }
    },
    // {
    //   $project: {
    //     documents: {
    //       $map: {
    //         input: '$documents',
    //         as: 'doc',
    //         in: {
    //           $mergeObjects: [
    //             '$$doc',
    //             excludeFieldsProject
    //           ]
    //         }
    //       }
    //     }
    //   }
    // }
  ];
};

const searchAndGroup = async (model, searchTerm, fieldsToExclude) => {
  try {
    const pipeline = generateDynamicPipeline(searchTerm, fieldsToExclude);
    const results = await model.aggregate(pipeline);
    console.log(results);
    return results;
  } catch (err) {
    console.error(err);
  }
};

exports.search = async (query) => {
  // const regexQuery = new RegExp(String.raw`${query}`, "i");
  const users = await searchAndGroup(UserModel, query, ['__v -updatedAt']);
  const posts = await searchAndGroup(PostModel, query, ['__v -updatedAt']);
  // const users = await UserModel.find({
  //   $or: [
  //       {name: regexQuery},
  //       {latestWorkDesignation: regexQuery}
  //   ]
  // }, '-__v -createdAt -updatedAt').exec();
  // const posts = await PostModel.find({
  //   $or: [
  //       {title: regexQuery},
  //       {location: regexQuery},
  //       {caption: regexQuery}
  //   ]
  // }, '-__v -createdAt -updatedAt').exec();
  return {
    users,
    posts,
  };
};
