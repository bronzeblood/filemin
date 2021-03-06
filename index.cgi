#!/usr/bin/perl
# File manager written in perl

#$unsafe_index_cgi = 1;
require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use POSIX;
#use File::Basename;

&ReadParse();

use Data::Dumper;

get_paths();

unless (opendir ( DIR, $cwd )) {
    $path="";
    print_errors("$text{'error_opendir'} $cwd $!");
} else {
    &ui_print_header(undef, "Filemin", "");

##########################################
#---------LET DA BRAINF###ING BEGIN----------
    # Push file names with full paths to array, filtering out "." and ".."
    @list = map { &simplify_path("$cwd/$_") } grep { $_ ne '.' && $_ ne '..' } readdir(DIR);
    closedir(DIR);

    # Filter out not allowed entries
    if($remote_user_info[0] ne 'root' && $allowed_paths[0] ne '$ROOT') {
        # Leave only allowed
        for $path(@allowed_paths) {
            push @tmp_list, grep {"$path/" =~ /^$_\// || $_ =~ /$path\//} @list;
        }
        # Remove duplicates
        my %hash   = map { $_, 1 } @tmp_list;
        @list = keys %hash;
    }
    # Get info about directory entries
    @info = map { [ $_, stat($_), mimetype($_) ] } @list;

    #filter out folders
    @folders = map {$_} grep {$_->[14] eq 'inode/directory' } @info;

    #filter out files
    @files = map {$_} grep {$_->[14] ne 'inode/directory' } @info;

    #sort stuff by name
    @folders = sort { $a->[0] cmp $b->[0] } @folders;
    @files = sort { $a->[0] cmp $b->[0] } @files;
    undef(@list);
    push @list, @folders, @files;

#########################################

    print_interface();

    &ui_print_footer("/", $text{'index'});
}


