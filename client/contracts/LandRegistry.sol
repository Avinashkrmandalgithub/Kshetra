// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
contract AllLandRegistry {
    address[] public LandRegistryAdress;
    event SaveLandRegistry(
        string FullName,
        bytes32 indexed _AadhaarHash,
        uint64 _PlotNumber,
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
        uint64 _PlotNumber,
        string memory _area,
        string memory _Location,
        string memory _imgUrl
    ) public {
        LandRegistry nweLandRegistry = new LandRegistry(
            _FullName,
            _AadhaarHash,
            _PlotNumber,
            _area,
            _Location,
            _imgUrl,
            msg.sender
        );
        LandRegistryAdress.push(address(nweLandRegistry));
        emit SaveLandRegistry(
            _FullName,
            _AadhaarHash,
            _PlotNumber,
            _area,
            _Location,
            _imgUrl,
            msg.sender,
            address(nweLandRegistry),
            block.timestamp
        );
    }
}

contract LandRegistry {
    string public FullName;
    bytes32 public AadhaarHash;
    uint64 public PlotNumber;
    string public area;
    string public Location;
    string public imgUrl;
    address public Owner;
    constructor(
        string memory _FullName,
        bytes32 _AadhaarHash,
        uint64 _PlotNumber,
        string memory _area,
        string memory _Location,
        string memory _imgUrl,
        address _Owner
    ) {
        FullName = _FullName;
        AadhaarHash = _AadhaarHash;
        PlotNumber = _PlotNumber;
        area=_area;
        Location = _Location;
        imgUrl = _imgUrl;
        Owner = _Owner;
    }
}