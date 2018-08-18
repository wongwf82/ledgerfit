pragma solidity ^0.4.24;

contract LedgerFit {
    address public manager;
    address[] public reviewees;
    mapping(int256 => string) public Reviews;

    // deposit
    address public ledgerFitDeposit;    // Deposit address for LedgerFit fee
    address public charityDeposit;      // Deposit address for LedgerFit charity of choice

    constructor(address _ledgerFitDeposit, address _charityDeposit) public {
        ledgerFitDeposit = _ledgerFitDeposit;
        charityDeposit = _charityDeposit;
        manager = msg.sender;
    }

    // Adds a review which correlates to an IN transaction
    function setReview(int256 _inTransactionBlockHeight, address _inTransactionRecipient, string _remark)
    public
    revieweeOnly(_inTransactionRecipient)
    payable {
        require(msg.value > .03 ether);

        reviewees.push(msg.sender);

        Reviews[_inTransactionBlockHeight] = _remark;

        uint256 ledgerFitFee = .02 ether;
        uint256 charityDepositVal = address(this).balance - .02 ether;

        ledgerFitDeposit.transfer(ledgerFitFee);         // send the eth to LedgerFit
        charityDeposit.transfer(charityDepositVal);      // send the eth to LedgerFit charity of choice
    }

    // Sender must be same as recipient of inTransaction
    modifier revieweeOnly(address _inTransactionRecipient) {
        require(msg.sender == _inTransactionRecipient);
        _;
    }
}
