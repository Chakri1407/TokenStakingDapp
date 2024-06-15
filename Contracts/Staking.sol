// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard {
    IERC20 public s_stakingToken;
    IERC20 public s_rewardToken;

    uint256 public constant REWARD_RATE = 1e18;
    uint256 private totalStakedToken;
    uint256 public rewardPerTokenStored;
    uint256 public lastUpdateTime;

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public userRewardPerTokenpaid;

    event Staked(address indexed user, uint256 indexed amount);
    event Withdrawn(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed  amount);

    constructor(address stakingToken,address rewardToken){
        s_stakingToken = IERC20(stakingToken);
        s_rewardToken = IERC20(rewardToken);
    }

    function rewardPerToken() public view returns(uint){
        if(totalStakedToken == 0){
            return rewardPerTokenStored;
        }
        uint totalTime = block.timestamp - lastUpdateTime;
        uint totalRewards = REWARD_RATE*totalTime;
        return rewardPerTokenStored + totalRewards/totalStakedToken;
    }

    function earned(address account)  public view returns(uint){
        return ((stakedBalance[account]* (rewardPerToken()- userRewardPerTokenpaid[account])))+rewards[account];
    }

    modifier updateReward(address account){
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        userRewardPerTokenpaid[account] = rewardPerTokenStored;
        _;
    }

    function stake(uint amount) external nonReentrant updateReward(msg.sender){
    require(amount>0,"Amount must be greater than zero");
    totalStakedToken += amount;
    stakedBalance[msg.sender] += amount;
    emit Staked(msg.sender, amount);
    bool success = s_stakingToken.transferFrom(msg.sender, address(this),amount);
    require(success,"Transfer Failed");
    }

    function withdraw(uint amount) external nonReentrant updateReward(msg.sender){
    require(amount>0,"Amount must be greater than zero");
    require(stakedBalance[msg.sender] > amount,"Staked amount is not enough");
    totalStakedToken -= amount;
    stakedBalance[msg.sender] -= amount;
    emit Withdrawn(msg.sender, amount);
    bool success = s_stakingToken.transfer(msg.sender,amount);
    require(success,"Transfer Failed");
    }

    function getReward() external nonReentrant updateReward(msg.sender){
    uint reward = rewards[msg.sender];
    require(reward > 0,"No rewards to Claim");
    rewards[msg.sender] =0;
    emit RewardsClaimed(msg.sender, reward);
    bool success = s_rewardToken.transfer(msg.sender,reward);
    require(success,"Transfer Failed");
    }
}
