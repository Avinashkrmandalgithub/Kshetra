// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AllLandRegistry {
    address[] public LandRegistryAdress;

    event SaveLandRegistry(
        string FullName,
        bytes32 indexed _AadhaarHash,
        uint64 _PlotNumber1,
        uint64 _PlotNumber2,
        uint64 _PlotNumber3,
        uint64 _PlotNumber4,
        uint256 _Price, // Changed to uint256 to match msg.value standard
        string _area,
        string _Location,
        string _imgUrl,
        address owner,
        address indexed LandRegistryaddress,
        uint256 time
    );

    function AddNewLand(
        string memory _FullName,
        bytes32 _AadhaarHash,
        uint64 _PlotNumber1,
        uint64 _PlotNumber2,
        uint64 _PlotNumber3,
        uint64 _PlotNumber4,
        uint256 _Price, // Changed to uint256
        string memory _area,
        string memory _Location,
        string memory _imgUrl
    ) public {
        LandRegistry newLandRegistry = new LandRegistry(
            _FullName,
            _AadhaarHash,
            _PlotNumber1,
            _PlotNumber2,
            _PlotNumber3,
            _PlotNumber4,
            _Price,
            _area,
            _Location,
            _imgUrl,
            msg.sender
        );
        
        LandRegistryAdress.push(address(newLandRegistry));
        
        emit SaveLandRegistry(
            _FullName,
            _AadhaarHash,
            _PlotNumber1,
            _PlotNumber2,
            _PlotNumber3,
            _PlotNumber4,
            _Price,
            _area,
            _Location,
            _imgUrl,
            msg.sender,
            address(newLandRegistry),
            block.timestamp
        );
    }
}

contract LandRegistry {
    string public FullName;
    bytes32 public AadhaarHash;
    uint64 public PlotNumber1;
    uint64 public PlotNumber2;
    uint64 public PlotNumber3;
    uint64 public PlotNumber4;
    uint256 public Price; // Changed to uint256
    string public area;
    string public Location;
    string public imgUrl;
    address payable public Owner; // Made payable so they can receive funds

    // Event indexed by AadhaarHash so you can easily query the chain for it later
    event LandBought(
        bytes32 indexed oldAadhaarHash,
        bytes32 indexed newAadhaarHash,
        address indexed oldOwner,
        address newOwner,
        uint256 price,
        uint256 timestamp
    );

    constructor(
        string memory _FullName,
        bytes32 _AadhaarHash,
        uint64 _PlotNumber1,
        uint64 _PlotNumber2,
        uint64 _PlotNumber3,
        uint64 _PlotNumber4,
        uint256 _Price,
        string memory _area,
        string memory _Location,
        string memory _imgUrl,
        address _Owner
    ) {
        FullName = _FullName;
        AadhaarHash = _AadhaarHash;
        PlotNumber1 = _PlotNumber1;
        PlotNumber2 = _PlotNumber2;
        PlotNumber3 = _PlotNumber3;
        PlotNumber4 = _PlotNumber4;
        Price = _Price;
        area = _area;
        Location = _Location;
        imgUrl = _imgUrl;
        Owner = payable(_Owner);
    }

    function buyLand(string memory _newFullName, bytes32 _newAadhaarHash) public payable {
        // 1. Verify exact payment
        require(msg.value == Price, "Must send the exact price of the land");
        
        // 2. Prevent the current owner from buying their own property
        require(msg.sender != Owner, "Owner cannot buy their own land");

        address payable previousOwner = Owner;
        bytes32 previousAadhaar = AadhaarHash;

        // 3. Transfer the funds to the previous owner
        // Using .call is the recommended way to transfer ETH to avoid gas limit issues
        (bool success, ) = previousOwner.call{value: msg.value}("");
        require(success, "Fund transfer to the seller failed");

        // 4. Update the land details to reflect the new buyer
        Owner = payable(msg.sender);
        FullName = _newFullName;
        AadhaarHash = _newAadhaarHash;

        // 5. Emit the transaction data to the blockchain
        emit LandBought(
            previousAadhaar,
            _newAadhaarHash,
            
            previousOwner,
            msg.sender,
            msg.value,
            block.timestamp
        );
    }
}