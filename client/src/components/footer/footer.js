// @flow
import React from "react";
import { Follow } from "react-twitter-widgets";
import { Actions as DonateModalActions } from "../../actions/donate-modal-actions";
import Icon from "../elements/icon/icon";
import { faHeart, faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";
import type { Props } from "../../flow-types/react-generic";
import "./footer.css";

export default (props: Props) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="content is-small">
          <div className="columns">
            <div className="column">
              <h4 className="created-by">
                <strong>PocketCap</strong> by{" "}
                <a
                  href="https://github.com/sergiubologa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="has-text-weight-normal"
                >
                  Sergiu Bologa
                </a>
                .
              </h4>
              <Follow username="bologasergiu" options={{ size: "small" }} />

              <h5 className="contribute">Contribute on GitHub</h5>
              <div className="github-btns">
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=sergiubologa&repo=thepocketcap&type=star&count=true"
                  frameBorder="0"
                  scrolling="0"
                  width="90px"
                  height="20px"
                  title="Star PocketCap on GitHub"
                />
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=sergiubologa&type=follow&count=true"
                  frameBorder="0"
                  scrolling="0"
                  width="170px"
                  height="20px"
                  title="Follow Sergiu Bologa on GitHub"
                />
              </div>

              <p className="license has-text-grey">
                Source code is licensed{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://opensource.org/licenses/mit-license.php"
                >
                  MIT
                </a>
                .
              </p>
            </div>
            <div className="column">
              <h4>About</h4>
              <p>
                This is a project for all cryptocoins{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://bitcointalk.org/index.php?topic=375643.0"
                >
                  HODLers
                </a>
                . With PocketCap you can track the{" "}
                <span style={{ textDecoration: "line-through" }}>profit</span>{" "}
                loss on your crypto investments. Just create your portfolio,
                save/bookmark the URL and open it every time you want to see how
                your crypto portfolio is performing.
              </p>
            </div>
            <div className="column">
              <h4>
                Show some &nbsp;
                <Icon icon={faHeart} className="love-heart has-text-danger" />
              </h4>
              <p>
                If you like the app and want to support its maintenance and
                development, make a donation!
              </p>
              <button
                className="button is-success is-light"
                onClick={DonateModalActions.togleModalVisibility}
              >
                <span className="icon">
                  <Icon icon={faHandHoldingHeart} />
                </span>
                <span>Get involved!</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
