import { faker } from '@faker-js/faker';

/**
 * Reusable fake/test data generator built on @faker-js/faker.
 *
 * Usage inside a scenario:
 *   this.data.firstName = DataGenerator.randomFirstName();
 *   this.data.email     = DataGenerator.randomEmail();
 *
 * Store generated values in the scenario-scoped World data bag (`this.data`)
 * so the same value is reused across steps instead of being re-generated.
 */
class DataGenerator {
  static randomFirstName() {
    return faker.person.firstName();
  }

  static randomLastName() {
    return faker.person.lastName();
  }

  static randomFullName() {
    return faker.person.fullName();
  }

  static randomEmail() {
    return faker.internet.email();
  }

  static randomPhoneNumber() {
    return faker.phone.number();
  }

  static randomAddress() {
    return faker.location.streetAddress();
  }

  static randomCity() {
    return faker.location.city();
  }

  static randomZipCode() {
    return faker.location.zipCode();
  }

  static randomUsername() {
    return faker.internet.username();
  }

  static randomPassword(length = 12) {
    return faker.internet.password({ length });
  }

  static randomCompany() {
    return faker.company.name();
  }

  static randomNumber(max = 1000) {
    return faker.number.int({ max });
  }

  static randomString(length = 8) {
    return faker.string.alphanumeric(length);
  }

  static randomUrl() {
    return faker.internet.url();
  }
}

export default DataGenerator;
