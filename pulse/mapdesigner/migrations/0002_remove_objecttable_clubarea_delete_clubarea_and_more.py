# Generated by Django 5.1.3 on 2024-12-01 15:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mapdesigner', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='objecttable',
            name='clubArea',
        ),
        migrations.DeleteModel(
            name='ClubArea',
        ),
        migrations.DeleteModel(
            name='ObjectTable',
        ),
    ]
