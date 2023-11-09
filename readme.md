# move

## Overview

This Node.js application provides a command-line utility to move files from one location to another.

## Usage

Run the script using the `node` command followed by the script name and the required arguments:

```
move <source> <destination> [options]
```

- `<source>`: The path to the file you want to move.
- `<destination>`: The directory where you want the file to be moved.

### Options

- `--dryrun`: Perform a dry run without actually moving the file. Default is `false`.
- `-o, --overwrite`: Specifies the method of handling existing files. Can be one of the following:
  - `auto` (default): Automatically decide based on the file's existence and prompts.
  - `prompt`: Ask the user what to do if the destination file exists.
  - `skip`: Skip moving the file if the destination file exists.
  - `overwrite`: Overwrite the existing file in the destination.
- `-D, --delete`: Delete the source file after moving. Default is `true`.

### Examples

To move a file with a dry run to see the output without any actual operation:

```
move /path/to/source /path/to/destination --dryrun
```

To move a file and overwrite any existing file in the destination:

```
move /path/to/source /path/to/destination --overwrite overwrite
```

To move a file and keep the source file:

```
move /path/to/source /path/to/destination --delete false
```