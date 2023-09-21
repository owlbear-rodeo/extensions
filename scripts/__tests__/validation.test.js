import { expect, test } from "vitest";
import { validateManifest } from "../validation/manifest";

test("successfully validates valid manifest", () => {
  const validManifest = {
    title: "Example Extension Manifest",
    description: "An example manifest for testing",
    author: "Extension Tests",
    image: "https://example.com/",
    icon: "https://example.com/",
    tags: ["combat", "tool", "automation"],
    manifest: "https://example.com/manifest.json",
    "learn-more": "learn-more@email.com",
  };

  const expectedResult = [];

  expect(validateManifest(validManifest)).toStrictEqual(expectedResult);
});

test("throws error on invalid tag", () => {
  const invalidTagInManifest = {
    title: "Example Extension Manifest",
    description: "An example manifest for testing",
    author: "Extension Tests",
    image: "https://example.com/",
    icon: "https://example.com/",
    tags: ["combat", "tool", "automation", "built-by-owlbear"],
    manifest: "https://example.com/manifest.json",
    "learn-more": "learn-more@email.com",
  };

  const expectedResult = ['"tags[3]" contains an excluded value'];

  expect(validateManifest(invalidTagInManifest)).toStrictEqual(expectedResult);
});

test("should return all validation errors in one message", () => {
  const mulitpleValidationIssues = {
    description: "An example manifest for testing",
    author: "Extension Tests",
    icon: "example.com/",
    tags: [],
    manifest: "https://example.com/manifest.json",
  };

  const expectedResult = [
    '"title" is required',
    '"image" is required',
    '"icon" failed custom validation because Invalid URL',
    '"tags" must contain at least 1 items',
    '"learn-more" is required',
  ];

  expect(validateManifest(mulitpleValidationIssues)).toStrictEqual(
    expectedResult
  );
});

test("should return issue when learn-more is invalid", () => {
  const learnMoreInvalidationIssue = {
    title: "Example Extension Manifest",
    description: "An example manifest for testing",
    author: "Extension Tests",
    image: "https://example.com/",
    icon: "https://example.com/",
    tags: ["combat", "tool", "automation"],
    manifest: "https://example.com/manifest.json",
    "learn-more": "learn-more.com",
  };

  const expectedResult = [
    '"learn-more" does not match any of the allowed types',
  ];

  expect(validateManifest(learnMoreInvalidationIssue)).toStrictEqual(
    expectedResult
  );
});
