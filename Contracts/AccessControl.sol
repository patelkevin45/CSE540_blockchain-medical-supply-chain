// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AccessControl {
    // Contract owner (deployer)
    address public Owner;

    constructor() {
        Owner = msg.sender;
    }

    modifier onlyByOwner() {
        require(msg.sender == Owner, "Only owner can call");
        _;
    }

    // Participant counters
    uint256 public supplierCtr = 0;
    uint256 public labCtr = 0;
    uint256 public wholesalerCtr = 0;
    uint256 public pharmacyCtr = 0;

    // Participant structs and mappings
    struct IngredientSupplier {
        address addr;
        uint256 id;
        string name;
        string place;
    }
    mapping(uint256 => IngredientSupplier) public Suppliers;

    struct PharmaceuticalLab {
        address addr;
        uint256 id;
        string name;
        string place;
    }
    mapping(uint256 => PharmaceuticalLab) public Labs;

    struct Wholesaler {
        address addr;
        uint256 id;
        string name;
        string place;
    }
    mapping(uint256 => Wholesaler) public Wholesalers;

    struct Pharmacy {
        address addr;
        uint256 id;
        string name;
        string place;
    }
    mapping(uint256 => Pharmacy) public Pharmacies;

    // Registration functions (only owner)
    function addIngredientSupplier(address _address, string memory _name, string memory _place) public onlyByOwner {
        supplierCtr++;
        Suppliers[supplierCtr] = IngredientSupplier(_address, supplierCtr, _name, _place);
    }

    function addPharmaceuticalLab(address _address, string memory _name, string memory _place) public onlyByOwner {
        labCtr++;
        Labs[labCtr] = PharmaceuticalLab(_address, labCtr, _name, _place);
    }

    function addWholesaler(address _address, string memory _name, string memory _place) public onlyByOwner {
        wholesalerCtr++;
        Wholesalers[wholesalerCtr] = Wholesaler(_address, wholesalerCtr, _name, _place);
    }

    function addPharmacy(address _address, string memory _name, string memory _place) public onlyByOwner {
        pharmacyCtr++;
        Pharmacies[pharmacyCtr] = Pharmacy(_address, pharmacyCtr, _name, _place);
    }
}
