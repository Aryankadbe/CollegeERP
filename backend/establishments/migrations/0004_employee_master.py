# Generated by Django 4.2.19 on 2025-02-28 10:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_department_is_active'),
        ('establishments', '0003_alter_shift_master_early_going_time_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='EMPLOYEE_MASTER',
            fields=[
                ('CREATED_BY', models.CharField(blank=True, db_column='CREATED_BY', max_length=50, null=True)),
                ('CREATED_AT', models.DateTimeField(auto_now_add=True, db_column='CREATED_AT')),
                ('UPDATED_BY', models.CharField(blank=True, db_column='UPDATED_BY', max_length=50, null=True)),
                ('UPDATED_AT', models.DateTimeField(auto_now=True, db_column='UPDATED_AT')),
                ('DELETED_BY', models.CharField(blank=True, db_column='DELETED_BY', max_length=50, null=True)),
                ('DELETED_AT', models.DateTimeField(blank=True, db_column='DELETED_AT', null=True)),
                ('IS_DELETED', models.BooleanField(db_column='IS_DELETED', default=False)),
                ('RECORD_ID', models.AutoField(db_column='RECORD_ID', primary_key=True, serialize=False)),
                ('EMPLOYEE_ID', models.CharField(db_column='EMPLOYEE_ID', max_length=20, unique=True)),
                ('SHORT_CODE', models.CharField(blank=True, db_column='SHORT_CODE', max_length=20, null=True, unique=True)),
                ('EMP_NAME', models.CharField(db_column='EMP_NAME', max_length=100)),
                ('FATHER_NAME', models.CharField(blank=True, db_column='FATHER_NAME', max_length=100, null=True)),
                ('MOTHER_NAME', models.CharField(blank=True, db_column='MOTHER_NAME', max_length=100, null=True)),
                ('DATE_OF_BIRTH', models.DateField(db_column='DATE_OF_BIRTH')),
                ('PERMANENT_ADDRESS', models.TextField(db_column='PERMANENT_ADDRESS')),
                ('EMAIL', models.EmailField(db_column='EMAIL', max_length=254, unique=True)),
                ('LOCAL_ADDRESS', models.TextField(blank=True, db_column='LOCAL_ADDRESS', null=True)),
                ('PAN_NO', models.CharField(blank=True, db_column='PAN_NO', max_length=10, null=True)),
                ('PERMANENT_CITY', models.CharField(db_column='PERMANENT_CITY', max_length=50)),
                ('PERMANENT_PIN', models.CharField(db_column='PERMANENT_PIN', max_length=6)),
                ('DRIVING_LICENSE_NO', models.CharField(blank=True, db_column='DRIVING_LICENSE_NO', max_length=20, null=True)),
                ('SEX', models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], db_column='SEX', max_length=10)),
                ('MARITAL_STATUS', models.CharField(choices=[('single', 'Single'), ('married', 'Married'), ('other', 'Other')], db_column='MARITAL_STATUS', max_length=10)),
                ('DATE_OF_JOIN', models.DateField(db_column='DATE_OF_JOIN')),
                ('LOCAL_CITY', models.CharField(blank=True, db_column='LOCAL_CITY', max_length=50, null=True)),
                ('LOCAL_PIN', models.CharField(blank=True, db_column='LOCAL_PIN', max_length=6, null=True)),
                ('POSITION', models.CharField(db_column='POSITION', max_length=50)),
                ('BLOOD_GROUP', models.CharField(blank=True, db_column='BLOOD_GROUP', max_length=5, null=True)),
                ('IS_ACTIVE', models.CharField(db_column='IS_ACTIVE', default='yes', max_length=3)),
                ('PHONE_NO', models.CharField(blank=True, db_column='PHONE_NO', max_length=15, null=True)),
                ('MOBILE_NO', models.CharField(db_column='MOBILE_NO', max_length=15)),
                ('BANK_ACCOUNT_NO', models.CharField(blank=True, db_column='BANK_ACCOUNT_NO', max_length=20, null=True)),
                ('UAN_NO', models.CharField(blank=True, db_column='UAN_NO', max_length=20, null=True)),
                ('PROFILE_IMAGE', models.ImageField(blank=True, db_column='PROFILE_IMAGE', null=True, upload_to='employee_profiles/')),
                ('CATEGORY', models.ForeignKey(db_column='CATEGORY_ID', on_delete=django.db.models.deletion.PROTECT, to='accounts.category')),
                ('DEPARTMENT', models.ForeignKey(db_column='DEPARTMENT_ID', on_delete=django.db.models.deletion.PROTECT, to='accounts.department')),
                ('DESIGNATION', models.ForeignKey(db_column='DESIGNATION_ID', on_delete=django.db.models.deletion.PROTECT, to='accounts.designation')),
                ('EMP_TYPE', models.ForeignKey(db_column='EMP_TYPE_ID', on_delete=django.db.models.deletion.PROTECT, related_name='employees_type', to='establishments.type_master')),
                ('INSTITUTE', models.ForeignKey(db_column='INSTITUTE_CODE', on_delete=django.db.models.deletion.PROTECT, to='accounts.institute', to_field='CODE')),
                ('SHIFT', models.ForeignKey(db_column='SHIFT', on_delete=django.db.models.deletion.PROTECT, to='establishments.shift_master')),
                ('STATUS', models.ForeignKey(db_column='STATUS_ID', on_delete=django.db.models.deletion.PROTECT, related_name='employees_status', to='establishments.status_master')),
                ('UNIVERSITY', models.ForeignKey(db_column='UNIVERSITY_ID', on_delete=django.db.models.deletion.PROTECT, to='accounts.university')),
            ],
            options={
                'verbose_name': 'Employee Master',
                'verbose_name_plural': 'Employee Masters',
                'db_table': '"ESTABLISHMENT"."EMPLOYEE_MASTER"',
                'indexes': [models.Index(fields=['EMPLOYEE_ID'], name='EMPLOYEE_MA_EMPLOYE_0d29b2_idx'), models.Index(fields=['SHORT_CODE'], name='EMPLOYEE_MA_SHORT_C_720483_idx'), models.Index(fields=['EMAIL'], name='EMPLOYEE_MA_EMAIL_4df2f4_idx'), models.Index(fields=['MOBILE_NO'], name='EMPLOYEE_MA_MOBILE__39c4da_idx')],
            },
        ),
    ]
