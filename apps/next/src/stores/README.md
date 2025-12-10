# Stores

This folder should house the various zustand stores that may be utilized within the application. These are not treated as root level global stores and instead should be considered slices of a global tree that you can cherry pick anywhere in the application. If a store is intended to be "private" or constrained to a particular module/feature then you can colocate it there.
