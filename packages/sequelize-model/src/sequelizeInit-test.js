const sq = require('./sequelizeInit');
const { hacker } = require('faker');

describe('sequelizeInit', () => {
  test('sequelize should be initialized properly with models for all test schema entities', async () => {
    const governments = await sq.Government.findAll({ where: { id: 'x' } });
    expect(governments).toHaveLength(0);

    const missingGovernment = await sq.Government.findOne({ where: { id: 'x' } });
    expect(missingGovernment).toBeNull();

    const ministers = await sq.Minister.findAll({ where: { id: 'x' } });
    expect(ministers).toHaveLength(0);

    const ministries = await sq.Ministry.findAll({ where: { id: 'x' } });
    expect(ministries).toHaveLength(0);

    const votes = await sq.Vote.findAll({ where: { id: 'x' } });
    expect(votes).toHaveLength(0);
  });

  test('sequelize should call schema hooks', async () => {
    const createdMinistry = await sq.Ministry.create({ name: hacker.phrase(), budget: 77.9 });
    const fetchedMinistry = await sq.Ministry.findOne({
      where: {
        id: createdMinistry.id
      }
    });
    const updatedEntity = await fetchedMinistry.update({
      budget: 88.2
    });
    expect(updatedEntity.dataValues).toHaveProperty('budget', 88.2);
  });
});
