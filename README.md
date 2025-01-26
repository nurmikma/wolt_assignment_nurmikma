# Delivery Order Price Calculator (DOPC)

In building the Delivery Order Price Calculator (DOPC), I focused on learning React and TypeScript since they were key to making the app work. I already had some experience with Java, Vue.js, JavaScript, and HTML from my studies, but I needed to spend extra time understanding how React works, especially with components and hooks like useState and useEffect for managing state and updating the user interface.  

I also had to get used to TypeScript because it adds type checking to the code. This helped me catch errors earlier and made my code easier to read and maintain. I had to learn how to set types for variables, functions, and API responses to avoid bugs.For the form validation, I learned how to check if user inputs, like cart value and coordinates (latitude/longitude), were correct before doing any calculations. If something was wrong, I showed an error message so the user could fix it before submitting the form.  

I also worked with asynchronous programming using async and await to handle API calls for fetching venue data. This helped me deal with issues like network errors or incorrect data. Finally, I split complex calculations, like figuring out the delivery price and distance, into smaller functions, making the app easier to understand and maintain.  

In this test suite for the DeliveryOrderPriceCalculator component, I wrote tests to ensure the component works as expected. I checked that the input fields and buttons render correctly and that input values update as expected. I also tested the form validation, ensuring that an error message appears when the cart value is invalid. I tested the delivery pricing calculation by simulating a cart value input and verifying the correct value is displayed with the data-raw-value attribute. I also simulated the user location request but couldn't get the location in the test, though it works fine in the UI. The test ensures the getLocation function is called.  

I tried to keep the code as clean as possible and avoided inline commenting. If you have any additional questions, feel free to ask during the technical interview.

---

## Getting Started

### Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd wolt_assignment_nurmikma
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Scripts

| Command          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `npm start`      | Runs the app in development mode.                    |
| `npm test`       | Launches the test runner in watch mode.              |
| `npm run build`  | Builds the app for production in the `build` folder. |
| `npm run lint`   | Lints the codebase using ESLint.                     |
| `npm run format` | Formats code using Prettier.                         |

---

## Features

- **User Input**: Calculate delivery fees and surcharges interactively.
- **Reusable Components**: Modular and scalable React components.
- **Custom Hooks**: Logic separated into reusable hooks.
- **API Integration**: Fetch and process venue data for calculations.

---

## Testing

Run tests with:

```bash
npm test
```

Set up via `setupTests.ts` using [React Testing Library](https://testing-library.com/) and Jest.

---

## Built With

- **React** & **TypeScript**: Core framework for building UI.
- **ESLint & Prettier**: Linting and formatting for code quality.

---

## Resources

- [React Documentation](https://reactjs.org/)
- [Create React App](https://facebook.github.io/create-react-app/docs/getting-started)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ESLint](https://eslint.org/docs/latest/)
- [Prettier](https://prettier.io/docs/en/index.html)
