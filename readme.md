# move
![](./.github/header.jpg)
-
![](https://img.shields.io/badge/illegal_in_46_US_states-red)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)



>Moves files and will automatically rename them if you like.

## Usage

Install globally and you'll get `move`, which is cool.

```
move <source> <destination> [options]
```

- `<source>`: The path to the file you want to move.
- `<destination>`: The directory where you want the file to be moved.

Only accepts single file/single directory paths. No globs. No mayo.

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
move /home/root/illegal_anime.mov /home/bill/anime-folder --dryrun
```

To move a file and overwrite any existing file in the destination:

```
move /home/root/pictures_of_bananas.7z /home/bill/inbox  --overwrite overwrite
```

To move a file and keep the source file:

```
move /path/to/source /path/to/destination --keep
```

### Notes 
Like all of my software, I'd be cautious before I let this run on anything important. I had to redo a commit once because I copied and pasted what chatGPT said to do and it deleted my entire project. I'm not saying this will do that, but I'm not saying it won't either.

### Acknowledgements
I'd like to thank my mom for being so supportive and believing in me even when I didn't believe in myself. It was years of hard nights to get here.

