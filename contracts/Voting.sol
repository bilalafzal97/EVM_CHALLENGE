pragma solidity ^0.8.21;

contract Voting {
    struct Item {
        string name;
        uint256 voteCount;
    }

    Item[] public items;
    mapping(address => bool) public hasVoted;

    function proposeItem(string memory _item) public {
        require(bytes(_item).length > 0, "Item name cannot be empty");
        items.push(Item({
            name: _item,
            voteCount: 0
        }));
    }

    function voteForItem(uint256 _itemId) public {
        require(_itemId < items.length, "Invalid item ID");
        require(!hasVoted[msg.sender], "You have already voted for an item");

        items[_itemId].voteCount++;
        hasVoted[msg.sender] = true;
    }

    function getWinner() public view returns (uint256 winnerId, string memory winnerName, uint256 maxVotes) {
        maxVotes = 0;
        winnerId = 0;
        winnerName = "";

        for (uint256 i = 0; i < items.length; i++) {
            if (items[i].voteCount > maxVotes) {
                maxVotes = items[i].voteCount;
                winnerId = i;
                winnerName = items[i].name;
            }
        }

        require(maxVotes > 0, "No votes have been cast yet");
    }
}
