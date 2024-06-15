import { useState } from "react";
import "./App.css";
import Wallet from "./components/Wallet";
import Navigation from "./components/Navigation/Navigation";
import DisplayPanel from "./components/Display Panel/DisplayPanel";
import TokenApproval from "./components/StakeToken/TokenApproval";
import WithdrawStakeAmount from "./components/Withdraw/Withdraw";
import StakeAmount from "./components/StakeToken/StakeAmount";
import { StakingProvider } from "./context/StakingContext";

function App() {
  const [displaySection, setDisplaySection] = useState("stake");

  const handleButtonClick = (section) => {
    setDisplaySection(section);
  };
  return (
    <div className="main-section">
      <Wallet>
        <Navigation />
        <StakingProvider>
          <DisplayPanel />
          <div className="main-content">
            <div className="button-section">
              <button
                onClick={() => handleButtonClick("stake")}
                className={displaySection === "stake" ? "" : "active"}
              >
                Stake
              </button>
              <button
                onClick={() => handleButtonClick("withdraw")}
                className={displaySection === "withdraw" ? "" : "active"}
              >
                Withdraw
              </button>
            </div>
            {displaySection === "stake" && (
              <div className="stake-wrapper">
                <TokenApproval />
                <StakeAmount />
              </div>
            )}
            {displaySection === "withdraw" && (
              <div className="stake-wrapper">
                <WithdrawStakeAmount />
              </div>
            )}
          </div>
        </StakingProvider>
      </Wallet>
    </div>
  );
}

export default App;
