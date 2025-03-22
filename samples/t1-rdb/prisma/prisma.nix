{
  pkgs ? import <nixpkgs> {},
  prisma-utils ? builtins.getFlake "github:VanCoding/nix-prisma-utils",
}:
(prisma-utils.lib.prisma-factory {
  inherit pkgs;
  # just copy these hashes for now, and then change them when nix complains about the mismatch
  prisma-fmt-hash = "sha256-aBRInT5la9jpDicaOWoOeFXhpobZ/7eX2+XjpwGq4jg=";
  query-engine-hash = "sha256-WYDR5B4+bTYGQcnCXt/G1yOKnkK5EvW1g5ssE31IdBc=";
  libquery-engine-hash = "sha256-EynSJBeJgsz8ybap+6oKgaHQQfD7rQaZYf3FopvvsPY=";
  schema-engine-hash = "sha256-wr0qnOOoi31PVIL6Ql/Qd+K0/MR1+loZ2kYOZjhqy1Y=";
})
.fromBunLock
./bun.lock
