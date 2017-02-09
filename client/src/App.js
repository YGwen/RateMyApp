import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor() {
        super();
        var context = location.search.split('context=')[1]
        this.state = {
            rate: -1,
            feedback: "",
            composerVisible: false,
            step: 1,
            context : context
        };
    }

    rateCallback(rate) {
        this.setState({
            rate: rate,
            composerVisible: true,
            step : 2
        });
        console.log(this.state);
    }

    feedbackCallback(feedback) {
        this.setState({feedback: feedback});
    }

    renderHeader() {
        return <Header rateCallback={this.rateCallback.bind(this)}/>
    }

    renderBody() {
        var style = this.state.composerVisible ? {top: "141px"} : {top: "70px"};
        return <Body feedbackCallback={this.feedbackCallback.bind(this)} style={style}/>
    }

    handleSubmit(proxy, event) {
        proxy.preventDefault();
        var self = this;
        var http = new XMLHttpRequest();
        http.open("POST", "/api/feedback", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function () {
            self.setState({step: 3});
        }
        http.send(Object.keys(this.state).map((i) => i+'='+this.state[i]).join('&'));
        return false;
    }

    render() {
        var displayStep1and2 = this.state.step===1 || this.state.step===2  ? {left:0} : {left:'400px'};
        var height = this.state.step===1 ? {height:"139px"} : {height:"213px"};
        var displayStep3 = this.state.step===3 ? {top:0} : {top:'-215px'};
            return (
                <div className="rate-my-app" style={height}>
                    <form method="post" action="/api/feedback" onSubmit={this.handleSubmit.bind(this)}
                          className="rate-my-app-messenger" id="feedbackform" style={displayStep1and2}>
                        {this.renderHeader()}
                        {this.renderBody()}
                    </form>
                    <div className="rate-my-app-final" style={displayStep3}>
                        <div className="rate-my-app-final-text-container">
                            <div className="rate-my-app-final-text-container-title">Thank you !</div>
                            <div className="rate-my-app-final-text-container-content">You're amazing !</div>
                        </div>
                    </div>

                </div>
            );
    }
}

class Header extends Component {
    renderRatings() {
        return <Ratings rateCallback={this.props.rateCallback}/>
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
    constructor(rate, rateCallback) {
        super();
        this.state = {
            rate: rate,
            rateCallback: rateCallback
        };
    }

    rateCallback(rate) {
        this.setState({rate: rate});
        this.props.rateCallback(rate);
    }

    renderRates(className, rate, selected) {
        return <Rate className={className} rate={rate} rateCallback={this.rateCallback.bind(this)} selected={selected}/>
    }

    render() {
        return (
            <div className="rate-my-app-messenger-header-ratings-container">
                {this.renderRates("rate-my-app-rate-very-bad", 0, this.state.rate === 0)}
                {this.renderRates("rate-my-app-rate-bad", 33, this.state.rate === 33)}
                {this.renderRates("rate-my-app-rate-good", 66, this.state.rate === 66)}
                {this.renderRates("rate-my-app-rate-very-good", 100, this.state.rate === 100)}
                <input type="hidden" name="rate" ref="ratings" value={this.state.rate}/>
            </div>
        );
    }
}

class Rate extends Component {
    clickHandler() {
        this.props.rateCallback(this.props.rate);
    }

    render() {
        var active = this.props.selected ? "rate-my-app-messenger-header-rate-active" : "";
        var className = "rate-my-app-messenger-header-rate " + active + " " + this.props.className;
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
        this.setState({feedback: feedback});
    }

    renderFeedbackComposer() {
        return <FeedbackComposer addFeedback={this.addFeedback.bind(this)}
                                 feedbackCallback={this.props.feedbackCallback}/>
    }

    render() {
        return (
            <div className="rate-my-app-messenger-body" style={this.props.style}>
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
        this.props.feedbackCallback(event.target.value);
    }

    render() {
        return (
            <div className="rate-my-app-messenger-body-feedback-composer-container">
                <textarea onChange={this.onChange.bind(this)}
                          value={this.state.value} name="feedback"
                          className="rate-my-app-messenger-body-feedback-composer"
                          placeholder="How can we improve it?"/>
                <button className="rate-my-app-messenger-body-feedback-composer-send" type="submit" form="feedbackform"
                        value="submit"/>
            </div>
        );
    }
}

export default App;
