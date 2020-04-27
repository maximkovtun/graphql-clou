const Sequelize = require('@venncity/sequelize');
const { trimEnd } = require('lodash');

const Op = Sequelize.Op;

function buildConditionSubquery(targetModel, filter, isNegative = false) {
  const positiveOrNegative = isNegative ? Op.not : Op.and;
  const queryGenerator = targetModel.QueryGenerator;
  const options = {
    ...filter,
    attributes: ['id'],
    where: {
      [Op.and]: [
        {
          [positiveOrNegative]: filter.where
        }
      ]
    }
  };
  // eslint-disable-next-line no-underscore-dangle
  Sequelize.Model._validateIncludedElements.bind(targetModel)(options);
  removeIncludesAttributes(options.include);
  const selectQuery = queryGenerator.selectQuery(targetModel.getTableName(), options, targetModel);
  return trimEnd(selectQuery, ';');
}

function removeIncludesAttributes(includes) {
  if (includes) {
    includes.forEach(i => {
      if (i.attributes) {
        i.attributes = [];
      }
      removeIncludesAttributes(i.include);
    });
  }
}

module.exports = {
  buildConditionSubquery
};
