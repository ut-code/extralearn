{pkgs ? import <nixpkgs> {}}: let
  pname = "hello-nix";
in
  pkgs.stdenv.mkDerivation {
    inherit pname;
    version = "0.0.0";
    src = ./.;
    buildInputs = [pkgs.go];
    buildPhase = ''
      export GOCACHE=/tmp/gocache
      go build ./main.go
    '';
    installPhase = ''
      mkdir -p $out/bin
      mv ./main $out/bin/${pname}
    '';
  }
