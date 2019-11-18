const { hacker } = require('faker');
const { runGenericDAOTests, createServiceAuthContext } = require('./../test/baseTestForDAOs');
const createAllDAOs = require('./../test/DAOs');

function buildTestObject() {
  return {
    name: hacker.phrase()
  };
}

describe('generic tests', () => {
  runGenericDAOTests({
    entityName: 'government',
    createAllDAOs,
    getDefaultEntityFunc: buildTestObject,
    stringFieldName: 'name'
  });

  let serviceContext;
  let governmentDAO;
  beforeAll(async () => {
    serviceContext = await createServiceAuthContext();
    governmentDAO = createAllDAOs().governmentDAO;
  });

  test('fetch by unique non-id field', async () => {
    await governmentDAO.createGovernment(serviceContext, { ...buildTestObject(), country: 'DE' });
    const governmentByCountry = await governmentDAO.government(serviceContext, { country: 'DE' });
    expect(governmentByCountry).toHaveProperty('country', 'DE');
    await governmentDAO.deleteGovernment(serviceContext, { country: 'DE' });
  });

  test('fetch connection', async () => {
    let governmentsConnectionResult = await governmentDAO.governmentsConnection(null, { where: { id: 'x' } }, serviceContext);
    expect(governmentsConnectionResult.aggregate).toHaveProperty('count', 0);
  });
});
