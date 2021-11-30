from django.db import models
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.contrib.auth.validators import ASCIIUsernameValidator


class CustomUserManager(UserManager):
    use_in_migrations = True

    def _create_user(self, user_id, password, **extra_fields):
        if not user_id:
            raise ValueError('The given user_id must be set')
        user_id = self.model.normalize_username(user_id)
        user = self.model(user_id=user_id, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, user_id, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(user_id, password, **extra_fields)

    def create_superuser(self, user_id, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(user_id, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    user_id_validator = ASCIIUsernameValidator()

    user_id = models.CharField(_('user_id'),validators=[user_id_validator], max_length=30, blank=False, unique=True)
    display_name = models.CharField(_('display_name'), max_length=30, blank=True)
    description = models.CharField(_('description'), max_length=300, blank=True)
    avatar = models.ImageField(upload_to="image/", blank=True, null=True)
    follower = models.IntegerField(default=0)
    followee = models.IntegerField(default=0)

    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_(
            'Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'user_id'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    @property
    def username(self):
        return self.user_id