/**
 * URL Validation utilities for social profiles and portfolio
 */

/**
 * Validates GitHub profile URL
 * Accepts: github.com/username, https://github.com/username, www.github.com/username
 */
export const validateGitHubUrl = (url: string): boolean => {
  const gitHubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/?$/i;
  return gitHubRegex.test(url);
};

/**
 * Validates LinkedIn profile URL
 * Accepts: linkedin.com/in/username, https://linkedin.com/in/username, etc.
 */
export const validateLinkedInUrl = (url: string): boolean => {
  const linkedInRegex =
    /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/i;
  return linkedInRegex.test(url);
};

/**
 * General portfolio URL validation
 * Accepts basic URLs with domain and TLD
 */
export const validatePortfolioUrl = (url: string): boolean => {
  const portfolioRegex =
    /^(https?:\/\/)?(www\.)?[\w-]+\.[\w]{2,}(\/[\w-]*)*\/?$/i;
  return portfolioRegex.test(url);
};

/**
 * Ant Design form validator for GitHub URLs
 */
export const gitHubUrlValidator = (_: unknown, value: string) => {
  if (!value) return Promise.resolve();
  if (validateGitHubUrl(value)) {
    return Promise.resolve();
  }
  return Promise.reject(
    new Error(
      "Please enter a valid GitHub URL (e.g., github.com/username or https://github.com/username)",
    ),
  );
};

/**
 * Ant Design form validator for LinkedIn URLs
 */
export const linkedInUrlValidator = (_: unknown, value: string) => {
  if (!value) return Promise.resolve();
  if (validateLinkedInUrl(value)) {
    return Promise.resolve();
  }
  return Promise.reject(
    new Error(
      "Please enter a valid LinkedIn URL (e.g., linkedin.com/in/username or https://linkedin.com/in/username)",
    ),
  );
};

/**
 * Ant Design form validator for Portfolio URLs
 */
export const portfolioUrlValidator = (_: unknown, value: string) => {
  if (!value) return Promise.resolve();
  if (validatePortfolioUrl(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error("Please enter a valid portfolio URL"));
};
