import React from "react";
import ReactDOM from "react-dom";

import { Form, Label, Input, Button } from "semantic-ui-react";

///////////////////////////////////////////////////////////////////////////////

class FormWizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStepIndex: 0
    };
  }

  getTotalSteps = children => {
    let totalSteps = 0;
    for (let child of children) {
      if (child.type.name === "StepList") {
        totalSteps = child.props.children.length - 1;
      }
    }
    this.setState({ totalSteps: totalSteps });
  };

  submitHandler = () => {
    alert("Form submitted!");
  };

  componentDidMount() {
    this.getTotalSteps(this.props.children);
  }

  render() {
    const children = React.Children.map(this.props.children, child => {
      if (child.type.name === "StepList") {
        return React.cloneElement(child, {
          activeStepIndex: this.state.activeStepIndex
        });
      } else if (child.type.name === "ButtonList") {
        return React.cloneElement(child, {
          activeStepIndex: this.state.activeStepIndex,
          totalSteps: this.state.totalSteps,
          handleSubmit: () => this.submitHandler(),
          onNextStep: () => {
            this.setState({
              activeStepIndex: this.state.activeStepIndex + 1
            });
          },
          onPreviousStep: () => {
            this.setState({
              activeStepIndex: this.state.activeStepIndex - 1
            });
          }
        });
      } else {
        return child;
      }
    });

    return <Form>{children}</Form>;
  }
}

//////////////////////////////////////////////////////////////////////////////

class StepList extends React.Component {
  render() {
    const { activeStepIndex } = this.props;
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        isActive: index === activeStepIndex
      });
    });
    return children;
  }
}

class ButtonList extends React.Component {
  render() {
    const { activeStepIndex, totalSteps } = this.props;
    const children = React.Children.map(this.props.children, (child, index) => {
      if (child.type.name === "Previous") {
        return React.cloneElement(child, {
          isPreviousActive: activeStepIndex > 0 ? true : false,
          goToPreviousStep: () => this.props.onPreviousStep()
        });
      } else if (child.type.name === "Next") {
        return React.cloneElement(child, {
          isNextActive: activeStepIndex < totalSteps ? true : false,
          goToNextStep: () => this.props.onNextStep()
        });
      } else if (child.type.name === "Submit") {
        return React.cloneElement(child, {
          isLastStep: activeStepIndex == totalSteps,
          handleSubmit: () => this.props.handleSubmit()
        });
      }
    });
    return children;
  }
}

///////////////////////////////////////////////////////////////////////////////

const Step = props => {
  if (props.isActive) {
    return <React.Fragment>{props.render()}</React.Fragment>;
  }

  return null;
};

const Previous = props => {
  if (props.isPreviousActive) {
    return (
      <Button onClick={() => props.goToPreviousStep()} color="red" size="large">
        Previous
      </Button>
    );
  }

  return null;
};

const Next = props => {
  if (props.isNextActive) {
    return (
      <Button onClick={() => props.goToNextStep()} color="green" size="large">
        Next
      </Button>
    );
  }
  return null;
};

const Submit = props => {
  if (props.isLastStep) {
    return (
      <Button onClick={() => props.handleSubmit()} size="large">
        Submit
      </Button>
    );
  }
  return null;
};

////////////////////////////////////////////////////////////////////////////////

const RegistrationFields = () => {
  return (
    <React.Fragment>
      <Form.Input label="What is your name?" placeholder="Name" />
    </React.Fragment>
  );
};

const BillingFields = () => {
  return (
    <React.Fragment>
      <Form.Input
        label="What is your billing address?"
        placeholder="Billing address"
      />
    </React.Fragment>
  );
};

const MailingFields = () => {
  return (
    <React.Fragment>
      <Form.Input
        label="What is your mailing address?"
        placeholder="Mailing address"
      />
    </React.Fragment>
  );
};

///////////////////////////////////////////////////////////////////////////////

class Demo extends React.Component {
  render() {
    return (
      <div>
        <FormWizard>
          <StepList>
            <Step render={RegistrationFields} />
            <Step render={BillingFields} />
            <Step render={MailingFields} />
          </StepList>
          <ButtonList>
            <Previous />
            <Next />
            <Submit />
          </ButtonList>
        </FormWizard>
      </div>
    );
  }
}

export default Demo;

ReactDOM.render(<Demo />, document.getElementById("root"));
