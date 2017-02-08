import React, {Component} from 'react';
import './App.css';

class App extends Component {
    renderHeader() {
        return <Header/>
    }

    renderBody() {
        return <Body/>
    }

    handleSubmit(event){
        console.log('toto')
        console.log(this);
        console.log(arguments);
    }

    render() {
        return (
            <form method="post" action="/api/feedback" onSubmit={this.handleSubmit.bind(this)} className="rate-my-app-messenger" id="feedbackform">
                {this.renderHeader()}
                {this.renderBody()}
            </form>
        );
    }
}

class Header extends Component {
    renderRatings() {
        return <Ratings/>
    }

    render() {
        return (
            <div className="rate-my-app-messenger-header">
                <div className="rate-my-app-messenger-header-body">
                    <div className="rate-my-app-messenger-header-title">How do you feel about this page?</div>
                    <div className="rate-my-app-messenger-header-content">We'll build awesome features with your
                        feedback !
                    </div>
                    {this.renderRatings()}
                </div>
            </div>
        );
    }
}

class Ratings extends Component {
    constructor(){
        super();
        this.state = {
            rate : -1
        };
    }

    rateCallback(rate){
        this.setState({rate : rate});
    }

    renderRates(className, rate, selected) {
        return <Rate className={className} rate={rate} rateCallback={this.rateCallback.bind(this)} selected={selected}/>
    }

    render() {
        return (
            <div className="rate-my-app-messenger-header-ratings-container" ref="ratings">
                {this.renderRates("rate-my-app-rate-very-bad", 0, this.state.rate===0)}
                {this.renderRates("rate-my-app-rate-bad", 33, this.state.rate===33)}
                {this.renderRates("rate-my-app-rate-good", 66, this.state.rate===66)}
                {this.renderRates("rate-my-app-rate-very-good", 100, this.state.rate===100)}
                <input type="hidden" name="rate" value={this.state.rate} />
            </div>
        );
    }
}

class Rate extends Component {
    clickHandler() {
        this.props.rateCallback(this.props.rate);
    }

    render() {
        var active = this.props.selected ? "rate-my-app-messenger-header-rate-active" : "" ;
        var className = "rate-my-app-messenger-header-rate "+active +" " + this.props.className;
        console.log(active);
        return (
            <div className="rate-my-app-messenger-header-rate-container"
                 onClick={this.clickHandler.bind(this)}>
                <div className={className}/>
            </div>
        );
    }
}

class Body extends Component {
    constructor() {
        super();
        this.state = {
            messages: []
        }
    }

    addFeedback(feedback) {
        this.setState({feedback : feedback});
        console.log(this.state.feedback);
    }

    renderFeedbackComposer() {
        return <FeedbackComposer addFeedback={this.addFeedback.bind(this)}/>
    }

    render() {
        return (
            <div className="rate-my-app-messenger-body">
                {this.renderFeedbackComposer()}
            </div>
        );
    }
}

class FeedbackComposer extends Component {
    constructor() {
        super();
        this.state = {
            value: ""
        };
    }

    onChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <div className="rate-my-app-messenger-body-feedback-composer-container">
                <textarea onChange={this.onChange.bind(this)}
                          value={this.state.value} name="feedback"
                          className="rate-my-app-messenger-body-feedback-composer"
                          placeholder="How can we improve it?"/>
                <button className="rate-my-app-messenger-body-feedback-composer-send" type="submit" form="feedbackform" value="submit"/>
            </div>
        );
    }
}

export default App;
