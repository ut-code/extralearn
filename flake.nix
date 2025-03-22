{
  description = "extra learn devShell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    prisma-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      prisma = pkgs.callPackage ./samples/t1-rdb/prisma/prisma.nix {inherit prisma-utils;};
    in {
      devShells.default = pkgs.mkShell {
        inherit (prisma) env;
        packages = [
          pkgs.bun
          pkgs.nodejs
          pkgs.astro-language-server
          pkgs.typos
          pkgs.litecli
        ];
      };
    });
}
