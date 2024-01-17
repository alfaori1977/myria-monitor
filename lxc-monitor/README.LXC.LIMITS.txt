
https://unix.stackexchange.com/questions/747085/error-too-many-open-files-while-starting-service-in-environment-with-several



I believe you are not hitting a global limit, but an inotify limit. This would be seen on containers running systemd because systemd uses the inotify facility for its bookkeeping, but the host would also be affected. Containers not using systemd (nor inotify) would probably be unaffected.

/proc/sys/fs/inotify/max_user_instances:

This specifies an upper limit on the number of inotify instances that can be created per real user ID.

If only non-rootless (ie: root in the container is the real root) containers are in use, then root user becomes the bottleneck. Having multiple containers using the same rootless user mapping would also create such bottleneck for this container's root user (but not affect the host). The default is 128, far too little for containers use.

CentOS7 (or Rocky9) doesn't include any default setup for this with LXC. Debian-based distributions include this file on the host:

/etc/sysctl.d/30-lxc-inotify.conf:

# Defines the maximum number of inotify listeners.
# By default, this value is 128, which is quickly exhausted when using
# systemd-based LXC containers (15 containers are enough).
# When the limit is reached, systemd becomes mostly unusable, throwing
# "Too many open files" all around (both on the host and in containers).
# See https://kdecherf.com/blog/2015/09/12/systemd-and-the-fd-exhaustion/
# Increase the user inotify instance limit to allow for about
# 100 containers to run before the limit is hit again
fs.inotify.max_user_instances = 1024
So you should do the same by creating this file on the host. For immediate effect (on the host):

sysctl -w fs.inotify.max_user_instances=1024

