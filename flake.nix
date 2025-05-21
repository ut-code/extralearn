{
  description = "extra learn devShell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
    bunnix.url = "github:aster-void/bunnix";
    bunnix.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    prisma-utils,
    bunnix,
    self,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      prisma = pkgs.callPackage ./samples/t1-rdb/prisma/prisma.nix {inherit prisma-utils;};
    in {
      packages.hello-nix = pkgs.callPackage ./samples/nix/package.nix {};
      packages.default = self.packages.${system}.hello-nix;
      devShells.default = pkgs.mkShell {
        inherit (prisma) env;
        packages = [
          (bunnix.lib.${system}.fromToolVersionsFile ./.tool-versions)
          pkgs.nodejs
          pkgs.astro-language-server
          pkgs.typos
          pkgs.litecli
          pkgs.static-web-server
          pkgs.go
        ];
      };
    });
}
