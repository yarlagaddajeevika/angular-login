import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment, StringLiteral, ClassDeclaration, MethodDeclaration } from 'ts-morph';
import fs from 'fs';
import path from 'path';

// Initialize TypeScript project
const project = new Project({
  tsConfigFilePath: "../../tsconfig.json" // Adjust path 
});
project.addSourceFilesAtPaths("src/**/*.ts");

// Define an array to hold the E2E scenarios
function generateE2EScenarios() {
  const scenarios: string[] = [];

  // Process source files
  project.getSourceFiles().forEach((sourceFile) => {
    // Process component classes
    sourceFile.getClasses().forEach((cls) => {
      if (isAngularComponent(cls)) {
        const className = cls.getName();
        if (className) {
          scenarios.push(`Component: ${className}`);
          cls.getMethods().forEach((method) => {
            const methodName = method.getName();
            scenarios.push(`  Action: ${methodName} invoked`);
          });
          const templateUrl = getTemplateUrl(cls);
          if (templateUrl) {
            const templatePath = path.join(path.dirname(sourceFile.getFilePath()), templateUrl);
            if (fs.existsSync(templatePath)) {
              const templateContent = fs.readFileSync(templatePath, 'utf-8');
              scenarios.push(...analyzeTemplate(templateContent, className));
            } else {
              console.warn(`Template file ${templatePath} does not exist.`);
            }
          } else {
            console.warn(`No templateUrl found for ${className}`);
          }
        } else {
          console.warn(`Class without a name found.`);
        }
      }
    });

    // Process service classes
    sourceFile.getClasses().forEach((cls) => {
      if (isAngularService(cls)) {
        const className = cls.getName();
        if (className) {
          scenarios.push(`Service: ${className}`);
          cls.getMethods().forEach((method) => {
            const methodName = method.getName();
            scenarios.push(`  Action: ${methodName} invoked`);
            if (method.getParameters().length > 0) {
              scenarios.push(`  Action: ${methodName} with parameters`);
            }
          });
        }
      }
    });
  });

  // Save scenarios to a JSON file
  fs.writeFileSync('e2e-scenarios.json', JSON.stringify(scenarios, null, 2));

  console.log("E2E Scenarios saved to e2e-scenarios.json");
}

// Check if a class is an Angular component
function isAngularComponent(cls: ClassDeclaration): boolean {
  return cls.getDecorator('Component') !== undefined;
}

// Check if a class is an Angular service
function isAngularService(cls: ClassDeclaration): boolean {
  return cls.getDecorator('Injectable') !== undefined;
}

// Extract templateUrl from the @Component decorator
function getTemplateUrl(cls: ClassDeclaration): string | null {
  const decorator = cls.getDecorator("Component");
  if (decorator) {
    const args = decorator.getArguments();
    if (args.length > 0 && args[0].getKind() === SyntaxKind.ObjectLiteralExpression) {
      const objectLiteral = args[0] as ObjectLiteralExpression;
      const properties = objectLiteral.getProperties();
      const templateUrlProp = properties.find((p) => p.getKind() === SyntaxKind.PropertyAssignment && (p as PropertyAssignment).getName() === 'templateUrl') as PropertyAssignment | undefined;
      if (templateUrlProp) {
        const initializer = templateUrlProp.getInitializer();
        if (initializer && initializer.getKind() === SyntaxKind.StringLiteral) {
          return (initializer as StringLiteral).getText().replace(/['"]/g, '');
        }
      }
    }
  }
  return null;
}

// Analyze the HTML template to identify additional scenarios
function analyzeTemplate(template: string, className: string): string[] {
  const scenarios: string[] = [];

  // Identify buttons
  const buttonMatches = template.match(/<button[^>]*>(.*?)<\/button>/g);
  if (buttonMatches) {
    buttonMatches.forEach((match, index) => {
      const buttonText = match.replace(/<[^>]+>/g, '').trim();
      scenarios.push(`  Component: ${className} - Button [${index + 1}] (${buttonText}) clicked`);
      scenarios.push(`  Component: ${className} - Button [${index + 1}] (${buttonText}) disabled state checked`);
      scenarios.push(`  Component: ${className} - Button [${index + 1}] (${buttonText}) enabled state checked`);
    });
  }

  // Identify links
  const linkMatches = template.match(/<a[^>]*>(.*?)<\/a>/g);
  if (linkMatches) {
    linkMatches.forEach((match, index) => {
      const linkText = match.replace(/<[^>]+>/g, '').trim();
      scenarios.push(`  Component: ${className} - Link [${index + 1}] (${linkText}) clicked`);
      scenarios.push(`  Component: ${className} - Link [${index + 1}] (${linkText}) navigates to correct URL`);
    });
  }

  // Identify inputs
  const inputMatches = template.match(/<input[^>]*>/g);
  if (inputMatches) {
    inputMatches.forEach((match, index) => {
      scenarios.push(`  Component: ${className} - Input [${index + 1}] interaction with valid data`);
      scenarios.push(`  Component: ${className} - Input [${index + 1}] invalid data input`);
      scenarios.push(`  Component: ${className} - Input [${index + 1}] edge case: unexpected format`);
      scenarios.push(`  Component: ${className} - Input [${index + 1}] focus and blur events`);
    });
  }

  // Identify forms
  const formMatches = template.match(/<form[^>]*>/g);
  if (formMatches) {
    scenarios.push(`  Component: ${className} - Form submission with valid data`);
    scenarios.push(`  Component: ${className} - Form submission with invalid data`);
    scenarios.push(`  Component: ${className} - Form submission with missing required fields`);
    scenarios.push(`  Component: ${className} - Form field validation (e.g., email format, min length)`);
    scenarios.push(`  Component: ${className} - Form reset functionality`);
  }

  return scenarios;
}

// Run the script
generateE2EScenarios();
